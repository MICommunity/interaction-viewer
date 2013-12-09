//    xiNET interaction viewer
//    Copyright 2013 Rappsilber Laboratory
//
//    This product includes software developed at
//    the Rappsilber Laboratory (http://www.rappsilberlab.org/).

xiNET.Controller.prototype.checkLinks = function() {
    if (this.initComplete) {
        var suspendID = this.svgElement.suspendRedraw(5000);
        var links = this.proteinLinks.values();
        var linkCount = links.length;
        for (var l = 0; l < linkCount; l++) {
            var link = links[l];
            link.check();
        }
        this.svgElement.unsuspendRedraw(suspendID);
    }
};

xiNET.Controller.prototype.scale = function() {
    var suspendID = this.svgElement.suspendRedraw(5000);
    if (this.initComplete) {
        this.z = this.container.getScreenCTM().inverse().a;

        var proteins = this.proteins.values();
        var proteinCount = proteins.length;
        for (var p = 0; p < proteinCount; p++) {
            var prot = proteins[p];
            prot.setPosition(prot.x, prot.y); // this rescales the protein //TODO: check if this always need to happen
            if (prot.form !== 0)
                prot.setAllLineCoordinates();
        }

        var links = this.proteinLinks.values();
        var linkCount = links.length;
        for (var l = 0; l < linkCount; l++) {
            var protLink = links[l];
            if (protLink.fromInteractor !== protLink.toInteractor) {
                if (!protLink.fromInteractor.isParked && !protLink.toInteractor.isParked) {
                    if (protLink.fromInteractor.form === 0 && protLink.toInteractor.form === 0) {
                        protLink.line.setAttribute("stroke-width", this.z * xiNET.linkWidth);
                        protLink.highlightLine.setAttribute("stroke-width", this.z * 10);
                        protLink.fatLine.setAttribute("stroke-width", this.z * protLink.w);
                        if (protLink.ambig) {
                            protLink.dashedLine(true); //rescale spacing of dashes
                        }
                    }
                    else {
                        //inter protein res links
                        var c2 = protLink.sequenceLinks.keys().length;
                        for (var rl = 0; rl < c2; rl++) {
                            var resLink = protLink.sequenceLinks.values()[rl];
                          //  if (resLink.check()) {
                                protLink.sequenceLinks.values()[rl].glyph.setAttribute("stroke-width", this.z * xiNET.linkWidth);
                                protLink.sequenceLinks.values()[rl].highlightGlyph.setAttribute("stroke-width", this.z * 10);
                                if (resLink.ambig) {
                                    resLink.dashedLine(true); //rescale spacing of dashes
                                }
                          //  }
                        }
                    }
                }
            }
        }
    }
    this.svgElement.unsuspendRedraw(suspendID);
};